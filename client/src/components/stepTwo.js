import React from "react"
import ProposalForm from "./forms/proposalForm"

function StepTwo(props) {
  const activeStep = props.activeStep

  if (activeStep === 1) {
    return <ProposalForm accounts={props.accounts} contract={props.contract} />
  }
  return (
    <>
      <h2>Proposal Session Ended</h2>
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
