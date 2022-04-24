import React, { Component } from "react"

export default class ProposalForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: "",
      props: props,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }
  handleSubmit(event) {
    alert("Le nom a été soumis : " + this.state.value)
    event.preventDefault()
    this.state.props.contract.methods
      .setVote(this.state.value)
      .send({ from: this.props.accounts[0] })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Vote for a Proposal</h2>
        <select onChange={this.handleChange}>
          {this.props.proposals.map((proposal, i) => (
            <option key={i} value={i}>
              {i} - {proposal[0]}
            </option>
          ))}
          ;
        </select>
        <input className="submit-button" type="submit" value="Vote" />
      </form>
    )
  }
}
