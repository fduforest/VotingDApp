import React, { Component } from "react"

export default class ProposalForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      proposals: [{ name: "" }],
      props: props,
    }
  }

  handleProposalNameChange = (idx) => (e) => {
    const newProposals = this.state.proposals.map((proposal, sidx) => {
      if (idx !== sidx) return proposal
      return { ...proposal, name: e.target.value }
    })

    this.setState({ proposals: newProposals })
  }

  handleAddProposal = () => {
    let proposals = this.state.proposals
    this.setState({
      proposals: this.state.proposals.concat([{ name: "" }]),
    })
    this.state.props.contract.methods
      .addProposal(proposals[proposals.length - 1].name)
      .send({ from: this.props.accounts[0] })
  }

  render() {
    return (
      <form>
        <h2>Poposals</h2>

        {this.state.proposals.map((proposal, idx) => (
          <div className="proposal" key={idx}>
            <span className="proposal-number">{idx + 1}</span>
            <input
              className={`proposal ${proposal.name ? "disabled-input" : ""}`}
              type="text"
              placeholder={`Proposal #${idx + 1} name`}
              onChange={this.handleProposalNameChange(idx)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={this.handleAddProposal}
          className="submit-button"
        >
          Add Proposal
        </button>
      </form>
    )
  }
}
