from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsStudent
from ..serializers.qa_serializer import QARequestSerializer
from ..services.qa_service import generate_qa


class QAGeneratorView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        serializer = QARequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = generate_qa(
            user=request.user,
            project_id=serializer.validated_data['project_id'],
        )
        return Response(result, status=status.HTTP_200_OK)
