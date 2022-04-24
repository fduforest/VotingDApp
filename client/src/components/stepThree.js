import React from "react"
import VotingForm from "./forms/votingForm"

function StepThree(props) {
  const activeStep = props.activeStep

  console.log("props.proposals", props.proposals)

  if (activeStep === 2) {
    return (
      <VotingForm
        accounts={props.accounts}
        contract={props.contract}
        proposals={props.proposals}
      />
    )
  }
  return (
    <>
      <h2>Voting Session not started</h2>
      <p>Wait for Voting session starting</p>

      <div className="loader text-center"></div>
    </>
  )
}

export default (props) => {
  return (
    <div>
      <h1>Voting Session</h1>
      <StepThree
        workflowStatus={props.workflowStatus}
        accounts={props.accounts}
        contract={props.contract}
        proposals={props.proposals}
      />
    </div>
  )
}
