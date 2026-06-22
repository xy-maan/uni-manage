from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsStudent
from ..serializers.matchmaker_serializer import MatchmakerRequestSerializer
from ..services.matchmaker_service import generate_project_ideas


class ProjectMatchmakerView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        serializer = MatchmakerRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ideas = generate_project_ideas(
            user=request.user,
            team_size=serializer.validated_data['team_size'],
            project_type=serializer.validated_data['project_type'],
            project_id=serializer.validated_data.get('project_id'),
        )
        return Response(ideas, status=status.HTTP_200_OK)
