from __future__ import unicode_literals
from django.contrib import admin
from django.utils.translation import ugettext, ugettext_lazy as _

from .models import Post, PostUpvote, ViewedPostTracking


# Register your models here.
class PostAdmin(admin.ModelAdmin):

    # The fields to be used in displaying the Post model.
    list_display = ( 'author', 'image', 'description', 'avarage', 'created_at', 'updated_at', 'upvote_count')
    search_fields = ('description', 'author', 'avarage')

    # fieldsets = (
    #     (None, {'fields': ('title', 'link')}),
    #     (_('Writer'), {'fields': ('author')}),
    # )
    ordering = ('-created_at',)

class PostUpVoteAdmin(admin.ModelAdmin):

    list_display = ('post', 'voter', 'point', 'created_at')
    search_fields = ('post', 'voter', 'created_at')

    ordering = ('-created_at',)


# Now register the new Admin...
admin.site.register(Post, PostAdmin)
admin.site.register(PostUpvote, PostUpVoteAdmin)
admin.site.register(ViewedPostTracking)
