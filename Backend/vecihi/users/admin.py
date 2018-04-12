from __future__ import unicode_literals

from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.utils.translation import ugettext, ugettext_lazy as _

from .models import User, ViewedProfileTracking
from vecihi.marmara_majors import MAJORS


class AccountCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    error_messages = {
        'duplicate_email': _("A user with that email already exists."),
        'duplicate_username': _("A user with that username already exists."),
        'password_mismatch': _("The two password fields didn't match."),
    }

    email = forms.EmailField(label=_("Email"), max_length=255,
                            help_text='A valid email address, please.',
                            error_messages={
                                'invalid': _("This form is not a email address.")})

    username = forms.RegexField(label=_("Username"), max_length=30,
        regex=r'^[\w.+-]+$',
        help_text=_("Required. 30 characters or fewer. Letters, digits and "
                    "./+/-/_ only."),
        error_messages={
            'invalid': _("This value may contain only letters, numbers and "
                         "./+/-/_ characters.")})

    password1 = forms.CharField(label=_("Password"),
                                widget=forms.PasswordInput)
    password2 = forms.CharField(label=_("Password confirmation"),
                                widget=forms.PasswordInput,
            help_text=_("Enter the same password as above, for verification."))

    image = forms.ImageField(required=False)
    bio = forms.CharField(required=False, widget=forms.Textarea)

    widgets = {
        'major': forms.Select(choices=MAJORS),
    }

    class Meta:
        model = User
        fields = ('email', 'username', 'major', 'image', 'bio')

    def clean_username(self):
        # Since User.username is unique, this check is redundant,
        # but it sets a nicer error message than the ORM. See #13147.
        username = self.cleaned_data["username"]
        try:
            User._default_manager.get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError(
            self.error_messages['duplicate_username'],
            code='duplicate_username',
        )

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(AccountCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class AccountChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    email = forms.EmailField(label=_("Email"), max_length=255,
                             help_text='A valid email address, please.',
                             error_messages={
                                 'invalid': _("This form is not a email address.")})

    username = forms.RegexField(label=_("Username"), max_length=30,
                                regex=r'^[\w.+-]+$',
                                help_text=_("Required. 30 characters or fewer. Letters, digits and "
                                            "./+/-/_ only."),
                                error_messages={
                                    'invalid': _("This value may contain only letters, numbers and "
                                                 "./+/-/_ characters.")})

    password = ReadOnlyPasswordHashField(label=_("Password"),
         help_text=_("Raw passwords are not stored, so there is no way to see "
                     "this user's password, but you can change the password "
                     "using <a href=\"password/\">this form</a>."))
    image = forms.ImageField()
    
    widgets = {
        'major': forms.Select(choices=MAJORS),
    }

    class Meta:
        model = User
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(AccountChangeForm, self).__init__(*args, **kwargs)
        f = self.fields.get('user_permissions', None)
        if f is not None:
            f.queryset = f.queryset.select_related('content_type')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class AccountAdmin(UserAdmin):

    change_user_password_template = None

    # The forms to add and change user instances
    form = AccountChangeForm
    add_form = AccountCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'username', 'major', 'image', 'first_name', 'last_name',
                    'is_staff', 'is_superuser', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('email', 'username', 'first_name', 'last_name')

    filter_horizontal = ('groups', 'user_permissions',)

    fieldsets = (
        (None, {'fields': ('email', 'password', 'major', 'bio', 'image')}),
        (_('Personal info'), {'fields': ('username', 'first_name', 'last_name', 'date_joined')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
    )

    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'major', 'bio', 'image', 'password1', 'password2')}
         ),
    )

    ordering = ('-last_login',)

    filter_horizontal = ('groups', 'user_permissions',)


class ViewedProfileTrackingAdmin(admin.ModelAdmin):
    fields = ('actor', "who_visited_profile", "visited_time")
    list_display = ('actor', "visited_profile", "visited_time")


# Now register the new UserAdmin...
admin.site.register(User, AccountAdmin)
admin.site.register(ViewedProfileTracking, ViewedProfileTrackingAdmin)
