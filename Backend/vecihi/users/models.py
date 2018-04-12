from __future__ import unicode_literals

from django.conf import settings
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.db.models.signals import post_save
from django.core.mail import send_mail
from django.core import validators
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from vecihi.marmara_majors import MAJORS


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """
    Generate a token every time a new account object
    is created.
    """
    if created:
        Token.objects.create(user=instance)


class AccountManager(BaseUserManager):
    def _create_user(self, email, username, password, major, image,
                     is_staff, is_superuser, **extra_fields):
        """
        Creates and saves a Account with the given email, username and password.
        """
        now = timezone.now()

        if not email:
            raise ValueError('Users must have a valid email address.')

        if not username:
            raise ValueError('The given username must be set')

        email = self.normalize_email(email)
        try:
            del extra_fields['confirm_password']
        except KeyError:
            pass

        account = self.model(email=email, username=username, image=image, major=major,
                             is_staff=is_staff, is_active=True,
                             is_superuser=is_superuser, last_login=now,
                             date_joined=now, **extra_fields)

        account.set_password(password)
        account.save(using=self._db)
        return account

    def create_user(self, email, username, password, major, image=None, **extra_fields):
        return self._create_user(email, username, password, major, image, False, False,
                                 **extra_fields)

    def create_superuser(self, email, username, password, major, image=None, **extra_fields):
        return self._create_user(email, username, password, major, image, True, True,
                                 **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(
        verbose_name=_('email address'),
        max_length=255,
        unique=True,
    )

    username = models.CharField(_('username'), max_length=30, unique=True,
                help_text=_('Required. 30 characters or fewer. Letters, digits'
                            ' and ./+/-/_ only.'),
                validators=[
                    validators.RegexValidator(r'^[\w.+-]+$', _('Enter a valid username jebal.'), 'invalid')
                ])

    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)

    is_staff = models.BooleanField(_('staff status'), default=False,
        help_text=_('Designates whether the user can log into this admin site.'))
    is_active = models.BooleanField(_('active'), default=True,
        help_text=_('Designates whether this user should be treated as '
                    'active. Unselect this instead of deleting accounts.'))

    image = models.ImageField(upload_to='Images/',default='Images/None/No-img.jpg', blank=True, null=True)
    major = models.CharField(max_length=100, choices=MAJORS, default='Unknown', blank=False, null=False)
    bio = models.TextField(blank=True, null=True)
    # Use date_joined than created_at plz.
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        swappable = 'AUTH_USER_MODEL'

    def __unicode__(self):
        return self.email
    
    def __str__(self):
        return unicode(self).encode('utf-8')


    def get_email_id(self):
        """
        Returns account id.
        """
        return self.email

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()
    full_name = property(get_full_name)

    def get_short_name(self):
        "Returns the short name for the user."
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)


class ViewedProfileTracking(models.Model):
    actor = models.ForeignKey(User, related_name='who_visit_profile')
    visited_profile = models.ForeignKey(User, related_name='visited_profile')
    visited_time = models.DateTimeField(auto_now_add=True)
