import datetime

from django.utils import timezone
from django.db import models
from django.db.models import Count, Avg
from vecihi.users.models import User


class PostQuerySet(models.QuerySet):
    def upvotes(self):
        return self.annotate(Count('postupvote'))\
            .order_by('-postupvote__count')
    def upvotes_last_week(self):
        from_date = timezone.now() - datetime.timedelta(days=7)
        return self.filter(created_at__range=[from_date, timezone.now()]).annotate(Count('postupvote'))\
            .order_by('-postupvote__count')
    
    def avarage(self):
        return self.annotate(Count('avarage'))\
            .order_by('avarage__count')

    def newest(self):
        return self.order_by('-created_at')


class Post(models.Model):
    author = models.ForeignKey(User)
    description = models.CharField(max_length=110, null=True, blank=True)
    image = models.ImageField(upload_to='Images/', default='Images/None/No-img.jpg', blank=False, null=False)

    created_at = models.DateTimeField(db_index=True, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()
    sorted_objects = PostQuerySet.as_manager()

    def __unicode__(self):
        return self.description
    
    def __str__(self):
        return unicode(self).encode('utf-8')

    def _get_upvote_count(self):
        return self.postupvote_set.count()
    upvote_count = property(_get_upvote_count)

    def _get_post_rating_avarage(self):
        result = self.postupvote_set.filter(post=self.pk).aggregate(Avg("point"))
        return {"avarage": result["point__avg"] if result["point__avg"] else 0.0}
    avarage = property(_get_post_rating_avarage)

    class Meta:
        ordering = ['-created_at',]


class PostUpvote(models.Model):
    post = models.ForeignKey(Post)
    voter = models.ForeignKey(User)
    point = models.FloatField(default=0.0, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('voter', 'post'))


class ViewedPostTracking(models.Model):
    actor = models.ForeignKey(User, related_name='who_visit_post')
    visited_post = models.ForeignKey(Post)
    time = models.DateTimeField(auto_now_add=True)
