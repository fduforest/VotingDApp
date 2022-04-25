import React, { Component } from "react"

export default class AddVoterForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      voters: [{ address: "" }],
      props: props,
    }
  }

  handleVoterAddressChange = (idx) => (e) => {
    const newVoters = this.state.voters.map((voter, sidx) => {
      if (idx !== sidx) return voter
      return { ...voter, address: e.target.value.toString(16) }
    })
    this.setState({ voters: newVoters })
  }

  handleAddVoter = () => {
    let voters = this.state.voters
    this.setState({
      voters: this.state.voters.concat([{ address: "" }]),
    })
    this.state.props.contract.methods
      .addVoter(voters[voters.length - 1].address)
      .send({ from: this.props.accounts[0] })
  }

  render() {
    return (
      <form>
        <h3>Add Voters</h3>

        {this.state.voters.map((voter, idx) => (
          <div className="voter" key={idx}>
            <input
              type="text"
              placeholder={`Voter #${idx + 1} address`}
              onChange={this.handleVoterAddressChange(idx)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={this.handleAddVoter}
          className="submit-button"
        >
          Add voter
        </button>
      </form>
    )
  }
}
