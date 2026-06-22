from rest_framework import serializers


class ChatMessageSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=['user', 'assistant'])
    content = serializers.CharField()


class ChatRequestSerializer(serializers.Serializer):
    messages = ChatMessageSerializer(many=True, allow_empty=False)

    def validate_messages(self, value):
        if not value:
            raise serializers.ValidationError('At least one message is required.')
        if value[-1]['role'] != 'user':
            raise serializers.ValidationError('Last message must be from user.')
        return value


class ChatResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
