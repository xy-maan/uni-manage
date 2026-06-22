from rest_framework import serializers


class QARequestSerializer(serializers.Serializer):
    project_id = serializers.IntegerField()
