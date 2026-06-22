from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsStudent
from ..serializers.techstack_serializer import TechStackRequestSerializer
from ..services.techstack_service import recommend_tech_stack


class TechStackAdvisorView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        serializer = TechStackRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = recommend_tech_stack(
            user=request.user,
            idea=serializer.validated_data['idea'],
            skills=serializer.validated_data.get('skills', []),
            project_id=serializer.validated_data.get('project_id'),
        )
        return Response(result, status=status.HTTP_200_OK)
