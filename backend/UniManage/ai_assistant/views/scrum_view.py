from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsStudent
from ..serializers.scrum_serializer import ScrumRequestSerializer
from ..services.scrum_service import generate_scrum_breakdown


class ScrumMasterView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        serializer = ScrumRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        breakdown = generate_scrum_breakdown(
            user=request.user,
            project_description=serializer.validated_data['project_description'],
            project_id=serializer.validated_data.get('project_id'),
        )
        return Response(breakdown, status=status.HTTP_200_OK)
