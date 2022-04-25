import React from "react"
import ProposalForm from "./forms/proposalForm"

function StepTwo(props) {
  if (props.workflowStatus && props.workflowStatus === 1) {
    return <ProposalForm accounts={props.accounts} contract={props.contract} />
  }
  return (
    <>
      <h2>Proposal Session not Started</h2>
      <p>Wait for Voting session starting</p>
      <div className="loader text-center"></div>
    </>
  )
}

export default (props) => {
  return (
    <div>
      <h1>Proposals Session</h1>
      <StepTwo
        workflowStatus={props.workflowStatus}
        accounts={props.accounts}
        contract={props.contract}
      />
    </div>
  )
}
