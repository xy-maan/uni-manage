from rest_framework import serializers


class ProposalRequestSerializer(serializers.Serializer):
    proposal = serializers.CharField(min_length=20)
    project_id = serializers.IntegerField(required=False, allow_null=True)
