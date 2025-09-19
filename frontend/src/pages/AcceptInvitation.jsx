import Loading from "@/components/shared/Loading";
import useApi from "@/hooks/useApi";
import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const AcceptInvitation = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { data, loading, error } = useApi(
    `/trips/${id}/invite/accept?token=${token}`
  );

  if (loading) return <Loading />;
  if (data?.message == "Invitation accepted successfully") {
    navigate(`/trips/${id}`);
  }

  return <div>Accept Invitation</div>;
};

export default AcceptInvitation;
