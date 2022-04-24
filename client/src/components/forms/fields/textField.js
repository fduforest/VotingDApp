import React from "react"

export default class TextField extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.label}</p>
        <TextField
          value={this.props.value}
          hintText="Voter address"
          onChange={(event) => this.props.onChange(event.target.value)}
        />
        <p>{this.props.errorMessage}</p>
      </div>
    )
  }
}
