from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsStudentOrSupervisor
from ..serializers.chat_serializer import ChatRequestSerializer
from ..services.chat_service import process_chat


class ChatView(APIView):
    permission_classes = [IsAuthenticated, IsStudentOrSupervisor]

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = process_chat(serializer.validated_data['messages'])
        return Response({'message': message}, status=status.HTTP_200_OK)
