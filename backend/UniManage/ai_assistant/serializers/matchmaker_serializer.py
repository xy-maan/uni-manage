from rest_framework import serializers


class MatchmakerRequestSerializer(serializers.Serializer):
    team_size = serializers.IntegerField(min_value=1, max_value=10)
    project_type = serializers.ChoiceField(choices=['course', 'graduation'])
    project_id = serializers.IntegerField(required=False, allow_null=True)
