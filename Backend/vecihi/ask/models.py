from __future__ import unicode_literals

from django.db import models

from vecihi.users.models import User


class Question(models.Model):
	whom = models.ForeignKey(User)
	question = models.CharField(max_length=100, blank=False, null=False)
	created_at = models.DateTimeField(auto_now_add=True)
		
	def __unicode__(self):
		return self.question

	def __str__(self):
		return unicode(self).encode('utf-8')


class Answer(models.Model):
	question = models.OneToOneField(
		Question,
		on_delete=models.CASCADE,
		related_name='answer'
	)
	answer = models.CharField(max_length=100, blank=False, null=False)
	created_at = models.DateTimeField(auto_now_add=True)

	def __unicode__(self):
		return self.answer

	def __str__(self):
		return unicode(self).encode('utf-8')