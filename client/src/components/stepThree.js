import React from "react"
import VotingForm from "./forms/votingForm"

function StepThree(props) {
  if (props.workflowStatus && props.workflowStatus === 3) {
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
      <h3>Voting Session not started</h3>
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
        hasVoted={props.hasVoted}
      />
    </div>
  )
}
