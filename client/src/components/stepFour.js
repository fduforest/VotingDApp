import React, { useEffect } from "react"

export default ({ winningProposal }) => {
  if (winningProposal) {
    const { description, voteCount } = winningProposal
    return (
      <div>
        <h1>Voting Results Session</h1>
        <div>
          <strong>Winner :</strong> {winningProposal.description}
        </div>
        <div>
          <strong>Vote Count :</strong> {winningProposal.voteCount}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Voting Results Session</h1>
    </div>
  )
}
