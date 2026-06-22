from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsStudent
from ..serializers.proposal_serializer import ProposalRequestSerializer
from ..services.proposal_service import refine_proposal


class ProposalRefinerView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        serializer = ProposalRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = refine_proposal(
            user=request.user,
            proposal=serializer.validated_data['proposal'],
            project_id=serializer.validated_data.get('project_id'),
        )
        return Response(result, status=status.HTTP_200_OK)
