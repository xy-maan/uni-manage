from rest_framework import serializers


class TechStackRequestSerializer(serializers.Serializer):
    idea = serializers.CharField(min_length=10)
    skills = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    project_id = serializers.IntegerField(required=False, allow_null=True)
