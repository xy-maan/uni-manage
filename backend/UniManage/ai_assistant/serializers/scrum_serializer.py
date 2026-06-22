from rest_framework import serializers


class ScrumRequestSerializer(serializers.Serializer):
    project_description = serializers.CharField(min_length=10)
    project_id = serializers.IntegerField(required=False, allow_null=True)
