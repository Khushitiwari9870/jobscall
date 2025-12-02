from django.contrib import messages
from django.contrib.auth import authenticate, login, logout as django_logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.csrf import csrf_protect
from django.db.utils import OperationalError

from apps.jobs.models import Job
from apps.companies.models import Company
from apps.applications.models import Application
from apps.notifications.models import Delivery
from apps.cms.models import Page
from apps.cms.models import Post, CoolPlace  # new
from apps.profile.models import UserProfile
from .forms import (
    JobApplicationForm,
    JobPostForm,
    ProfileForm,
    EmployerLeadForm,
    ResumeCheckUploadForm,
)


def home(request: HttpRequest) -> HttpResponse:
    try:
        latest_jobs = Job.objects.select_related("company").order_by("-created_at")[:8]
    except OperationalError:
        latest_jobs = []
    try:
        featured_companies = Company.objects.order_by("name")[:8]
    except OperationalError:
        featured_companies = []
    try:
        cool_places = CoolPlace.objects.filter(is_active=True).order_by("order")[:12]
    except OperationalError:
        cool_places = []
    return render(
        request,
        "web/home.html",
        {"latest_jobs": latest_jobs, "featured_companies": featured_companies, "cool_places": cool_places},
    )


def jobs_list(request: HttpRequest) -> HttpResponse:
    try:
        qs = Job.objects.select_related("company").order_by("-created_at")
    except OperationalError:
        qs = Job.objects.none()
    q = request.GET.get("q")
    location = request.GET.get("location")
    if q:
        qs = qs.filter(title__icontains=q)
    if location:
        qs = qs.filter(location__icontains=location)
    paginator = Paginator(qs, 20)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    return render(request, "web/jobs_list.html", {"page_obj": page_obj, "q": q or "", "location": location or ""})


def job_detail(request: HttpRequest, pk: int) -> HttpResponse:
    job = get_object_or_404(Job.objects.select_related("company"), pk=pk)
    return render(request, "web/job_detail.html", {"job": job})


def companies_list(request: HttpRequest) -> HttpResponse:
    qs = Company.objects.all().order_by("name")
    q = request.GET.get("q")
    if q:
        qs = qs.filter(name__icontains=q)
    paginator = Paginator(qs, 24)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    return render(request, "web/companies_list.html", {"page_obj": page_obj, "q": q or ""})


# ---- Blog pages ----

def blog_list(request: HttpRequest) -> HttpResponse:
    try:
        posts_qs = Post.objects.filter(is_published=True).order_by("-published_at", "-id")[:30]
        posts = [
            {
                "title": p.title,
                "slug": p.slug,
                "excerpt": p.excerpt,
                "author": p.author,
                "cover": p.cover_image,
                "date": (p.published_at.strftime("%b %d, %Y") if p.published_at else ""),
                "tags": p.tags(),
            }
            for p in posts_qs
        ]
    except OperationalError:
        posts = []
    return render(request, "web/blog_list.html", {"posts": posts})


def blog_detail(request: HttpRequest, slug: str) -> HttpResponse:
    try:
        p = Post.objects.filter(slug=slug, is_published=True).first()
    except OperationalError:
        p = None
    if p:
        article = {
            "title": p.title,
            "author": p.author,
            "date": (p.published_at.strftime("%b %d, %Y") if p.published_at else ""),
            "content": p.content,
        }
    else:
        article = {
            "title": slug.replace("-", " ").title(),
            "author": "Editorial Team",
            "date": "",
            "content": "<p class='mb-4'>Article not found yet. Please add it in Admin &rarr; CMS &rarr; Posts.</p>",
        }
    return render(request, "web/blog_detail.html", {"article": article})


def login_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, "Welcome back!")
            return redirect("web:home")
        messages.error(request, "Invalid credentials")
    return render(request, "web/login.html")


def register_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        if not username or not password:
            messages.error(request, "Username and password are required")
        elif User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken")
        else:
            user = User.objects.create_user(username=username, email=email, password=password)
            messages.success(request, "Account created. Please log in.")
            return redirect("web:login")
    return render(request, "web/register.html")


@login_required
@csrf_protect
def apply_to_job(request: HttpRequest, pk: int) -> HttpResponse:
    job = get_object_or_404(Job.objects.select_related("company"), pk=pk)
    try:
        candidate = request.user.candidate_profile
    except CandidateProfile.DoesNotExist:  # pragma: no cover - safety
        messages.error(request, "Candidate profile not found for your account.")
        return redirect("web:job_detail", pk=pk)

    if request.method == "POST":
        form = JobApplicationForm(request.POST)
        if form.is_valid():
            app, created = Application.objects.get_or_create(
                candidate=candidate,
                job=job,
                defaults={
                    "resume_url": form.cleaned_data.get("resume_url", ""),
                    "cover_letter": form.cleaned_data.get("cover_letter", ""),
                },
            )
            if not created:
                # Update existing application details
                app.resume_url = form.cleaned_data.get("resume_url", app.resume_url)
                app.cover_letter = form.cleaned_data.get("cover_letter", app.cover_letter)
                app.save(update_fields=["resume_url", "cover_letter", "updated_at"])
            messages.success(request, "Your application has been submitted.")
            return redirect("web:my_applications")
    else:
        form = JobApplicationForm()
    return render(request, "web/apply.html", {"job": job, "form": form})


def _is_staff(user: User) -> bool:
    return bool(user and user.is_authenticated and user.is_staff)


@login_required
@user_passes_test(_is_staff)
@csrf_protect
def post_job(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = JobPostForm(request.POST)
        if form.is_valid():
            job = form.save()
            messages.success(request, "Job posted successfully.")
            return redirect("web:job_detail", pk=job.pk)
    else:
        form = JobPostForm()
    return render(request, "web/post_job.html", {"form": form})


@login_required
@user_passes_test(_is_staff)
def recruiter_dashboard(request: HttpRequest) -> HttpResponse:
    jobs = Job.objects.select_related("company").order_by("-created_at")[:50]
    applications = Application.objects.select_related("job", "candidate", "candidate__user").order_by("-applied_at")[:50]
    return render(request, "web/recruiter_dashboard.html", {"jobs": jobs, "applications": applications})


@login_required
def my_applications(request: HttpRequest) -> HttpResponse:
    try:
        candidate = request.user.candidate_profile
    except CandidateProfile.DoesNotExist:
        messages.error(request, "Candidate profile not found for your account.")
        return redirect("web:home")
    qs = (
        Application.objects.filter(candidate=candidate)
        .select_related("job", "job__company")
        .order_by("-applied_at")
    )
    paginator = Paginator(qs, 20)
    page_obj = paginator.get_page(request.GET.get("page"))
    return render(request, "web/my_applications.html", {"page_obj": page_obj})


@login_required
def alerts_page(request: HttpRequest) -> HttpResponse:
    # Placeholder view for alerts management page (server-rendered)
    return render(request, "web/alerts.html")


@login_required
def learning_catalog(request: HttpRequest) -> HttpResponse:
    # Placeholder view for learning catalog page (server-rendered)
    return render(request, "web/learning.html")


@login_required
@csrf_protect
def payments_purchase(request: HttpRequest) -> HttpResponse:
    # Placeholder purchase flow page. Integrate with payment provider in future.
    if request.method == "POST":
        plan = request.POST.get("plan", "")
        if not plan:
            messages.error(request, "Please select a plan.")
        else:
            messages.success(request, f"Purchase initiated for plan: {plan}")
            return redirect("web:home")
    return render(request, "web/payments.html")


# ---- Employer Services ----

@csrf_protect
def resume_checker(request: HttpRequest) -> HttpResponse:
    features = [
        {"title": "Better formatting", "desc": "We evaluate layout and readability."},
        {"title": "Actionable tips", "desc": "Concrete suggestions to improve score."},
        {"title": "Expert guidance", "desc": "Recommendations based on industry practice."},
    ]
    parameters = [
        "Format/Style",
        "Summary & Objective",
        "Contact Details",
        "Education Details",
        "Skills & Work Experience",
        "Resume action verbs",
    ]
    if request.method == "POST":
        form = ResumeCheckUploadForm(request.POST, request.FILES)
        if form.is_valid():
            req = form.save(commit=False)
            if request.user.is_authenticated:
                req.user = request.user
            req.status = "queued"
            req.save()
            messages.success(request, "Resume uploaded. We'll send your score soon.")
            return redirect("web:resume_checker")
    else:
        form = ResumeCheckUploadForm()
    return render(
        request,
        "web/services_resume_checker.html",
        {"features": features, "parameters": parameters, "form": form},
    )


@csrf_protect
def profile_booster(request: HttpRequest) -> HttpResponse:
    bullets = [
        "Highlight your profile to recruiters",
        "Get more calls and responses",
        "Stand out in search results",
    ]
    faqs = [
        {"q": "What is included?", "a": "Featured profile, resume booster and cover letter suggestions."},
        {"q": "How long does it take?", "a": "Activation within 24 hours for most orders."},
    ]
    reviews = [
        {"name": "Asha", "text": "Great response from recruiters."},
        {"name": "Mohit", "text": "Value addition with resume revamp."},
    ]
    if request.method == "POST":
        lead_form = EmployerLeadForm(request.POST)
        if lead_form.is_valid():
            lead_form.save()
            messages.success(request, "Thanks! Our team will contact you shortly.")
            return redirect("web:profile_booster")
    else:
        lead_form = EmployerLeadForm(initial={"source": "talk_to_expert"})
    return render(
        request,
        "web/services_profile_booster.html",
        {"bullets": bullets, "faqs": faqs, "reviews": reviews, "lead_form": lead_form},
    )


def robots_txt(_request: HttpRequest) -> HttpResponse:
    lines = [
        "User-agent: *",
        "Disallow:",
        "Sitemap: /sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


def sitemap_xml(_request: HttpRequest) -> HttpResponse:
    # Minimal static sitemap; extend to include dynamic URLs later
    xml = f"""<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">
  <url><loc>/</loc></url>
  <url><loc>/jobs/</loc></url>
  <url><loc>/companies/</loc></url>
  <url><loc>/learning/</loc></url>
</urlset>
"""
    return HttpResponse(xml.strip(), content_type="application/xml")


# -------- Additional pages for other backend apps --------


def search_page(request: HttpRequest) -> HttpResponse:
    q = request.GET.get("q", "").strip()
    location = request.GET.get("location", "").strip()
    employment_type = request.GET.get("employment_type", "").strip()
    jobs = companies = []
    if q or location or employment_type:
        try:
            jq = Job.objects.select_related("company")
            if q:
                jq = jq.filter(title__icontains=q)
            if location:
                jq = jq.filter(location__icontains=location)
            if employment_type:
                jq = jq.filter(employment_type=employment_type)
            jobs = jq.order_by("-created_at")[:50]
        except OperationalError:
            jobs = []
        try:
            cq = Company.objects.all()
            if q:
                cq = cq.filter(name__icontains=q)
            companies = cq.order_by("name")[:50]
        except OperationalError:
            companies = []
    return render(
        request,
        "web/search.html",
        {"q": q, "location": location, "employment_type": employment_type, "jobs": jobs, "companies": companies},
    )


@login_required
def notifications_page(request: HttpRequest) -> HttpResponse:
    try:
        qs = Delivery.objects.filter(user=request.user).order_by("-created_at")
        paginator = Paginator(list(qs.values("template__key", "status", "created_at")), 10)
        page_obj = paginator.get_page(request.GET.get("page"))
        items = [
            {"title": it["template__key"], "time": it["created_at"].strftime("%b %d, %Y")}
            for it in page_obj.object_list
        ]
    except OperationalError:
        # Graceful fallback if tables not migrated yet
        demo = [
            {"title": "Welcome to JobsCall", "time": "Just now"},
            {"title": "Your profile was viewed", "time": "2h"},
        ]
        paginator = Paginator(demo, 10)
        page_obj = paginator.get_page(request.GET.get("page"))
        items = page_obj.object_list
    return render(request, "web/notifications.html", {"items": items, "page_obj": page_obj})


@login_required
def recommendations_page(request: HttpRequest) -> HttpResponse:
    # Placeholder recommendations; integrate with apps.matching later
    try:
        rec_jobs = Job.objects.select_related("company").order_by("-created_at")[:8]
    except OperationalError:
        rec_jobs = []
    return render(request, "web/recommendations.html", {"jobs": rec_jobs})


@login_required
@user_passes_test(_is_staff)
def adminpanel_dashboard(request: HttpRequest) -> HttpResponse:
    # Placeholder analytics; integrate with apps.analytics later
    stats = {
        "users": User.objects.count(),
        "jobs": Job.objects.count() if Job._meta.db_table else 0,
        "companies": Company.objects.count() if Company._meta.db_table else 0,
        "applications": Application.objects.count() if Application._meta.db_table else 0,
    }
    return render(request, "web/adminpanel_dashboard.html", {"stats": stats})


@login_required
def analytics_dashboard(request: HttpRequest) -> HttpResponse:
    # Placeholder charts/metrics
    return render(request, "web/analytics.html")


def cms_page(request: HttpRequest, slug: str = "about") -> HttpResponse:
    try:
        page = Page.objects.filter(slug=slug, is_published=True).first()
    except OperationalError:
        page = None
    if page:
        return render(request, "web/cms_page.html", {"page": page})
    # Fallback to static templates if DB not available or page not found
    template = {
        "about": "web/cms_about.html",
        "contact": "web/cms_contact.html",
        "blog": "web/cms_blog.html",
    }.get(slug, "web/cms_about.html")
    return render(request, template)


@login_required
def profile_view(request: HttpRequest) -> HttpResponse:
    profile = None
    try:
        profile = request.user.candidate_profile
    except CandidateProfile.DoesNotExist:
        pass
    return render(request, "web/profile.html", {"profile": profile})


@login_required
@csrf_protect
def profile_edit(request: HttpRequest) -> HttpResponse:
    try:
        profile = request.user.candidate_profile
    except CandidateProfile.DoesNotExist:
        profile = CandidateProfile.objects.create(user=request.user)
    if request.method == "POST":
        form = ProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, "Profile updated.")
            return redirect("web:profile")
    else:
        form = ProfileForm(instance=profile)
    return render(request, "web/profile_edit.html", {"form": form, "profile": profile})


@login_required
def payments_history(request: HttpRequest) -> HttpResponse:
    # Placeholder; integrate with apps.payments models later
    items = []
    return render(request, "web/payments_history.html", {"items": items})


@login_required
def logout_view(request: HttpRequest) -> HttpResponse:
    django_logout(request)
    messages.success(request, "You have been logged out.")
    return redirect("web:home")
