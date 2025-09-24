import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
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
  console.log(data);
  console.log(id, token);
  if (loading) return <Loading />;
  if (data?.message == "Invitation accepted successfully") {
    navigate(`/trips/${id}`);
  } else if (data?.message == "You are already a collaborator") {
    navigate(`/trips/${id}`);
  }

  //create a button to redirect to the dashboard
  return (
    <div>
      <a href="/dashboard">
        <Button variant="outline">Go To Dashboard</Button>
      </a>
    </div>
  );
};

export default AcceptInvitation;
