import React, { Component } from "react"
import Voting from "./contracts/Voting.json"
import getWeb3 from "./getWeb3"
import "./App.css"
import MultiStep from "react-multistep"
import StepOne from "./components/stepOne"
import StepTwo from "./components/stepTwo"
import StepThree from "./components/stepThree"
import StepFour from "./components/stepFour"
import AddVoterForm from "./components/forms/addVoterForm"

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    onChainValue: 0,
    userAddress: null,
    activeStep: 0,
    workflowStatus: 0,
    proposals: [],
    isOwner: false,
    isRegistered: false,
    hasVoted: false,
    winningProposal: [{ description: null, voteCount: 0 }],
    steps: [
      { name: "StepOne", component: <StepOne /> },
      { name: "StepTwo", component: <StepTwo /> },
      { name: "StepThree", component: <StepThree /> },
      { name: "StepFour", component: <StepFour /> },
    ],
  }

  // componentDidMount : méthode qui permet de lancer une fct au moment ou app.js est instancié, si la page se lance bien elle envoie componentDidMount

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      /* on récupère le tableau des comptes sur le metamask du user */
      const accounts = await web3.eth.getAccounts()

      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = Voting.networks[networkId]
      /* Création de l'objet de contrat avec l'abi, le deployedNetwork et son address  */
      const instance = new web3.eth.Contract(
        Voting.abi,
        deployedNetwork && deployedNetwork.address
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance })

      let account = this.state.accounts[0]

      this.setState({
        userAddress: account.slice(0, 6) + "..." + account.slice(38, 42),
      })

      // Check if the user is the owner
      const owner = await instance.methods.owner().call()
      if (account === owner) {
        this.setState({
          isOwner: true,
        })
      }

      // Add admin as a voter
      /*
      if (this.state.isOwner === true && this.state.isRegistered === false) {
        await instance.methods.addVoter(account).send({ from: accounts[0] })
        this.setState({
          isRegistered: true,
        })
      }
      */

      // Check if the user has voted
      /*
      const voter = await instance.methods
        .getVoter(account)
        .call({ from: account })
      console.log("voter.hasVoted", voter.hasVoted)
      if (voter.hasVoted === true) {
        this.setState({
          hasVoted: true,
        })
      }
      */

      // get Workflow status
      let workflowStatus = parseInt(
        await instance.methods.workflowStatus().call(),
        10
      )
      console.log("workflowStatus", workflowStatus)
      this.setState({
        workflowStatus: workflowStatus,
      })
      if (workflowStatus === 1 || workflowStatus === 2) {
        this.setState({
          activeStep: 1,
        })
      } else if (workflowStatus === 3 || workflowStatus === 4) {
        this.setState({
          activeStep: 2,
        })
      } else if (workflowStatus === 5) {
        this.setState({
          activeStep: 3,
        })
      }

      console.log("this.state.activeStep", this.state.activeStep)

      // getProposals
      const proposals = await instance.methods
        .getProposals()
        .call({ from: accounts[0] })
      this.setState({
        proposals: proposals,
      })

      // getWinningProposal
      let winningProposalID = parseInt(
        await instance.methods.winningProposalID().call({ from: accounts[0] })
      )

      if (winningProposalID) {
        let winningProposal = proposals[winningProposalID]

        if (winningProposal) {
          this.setState((prevState) => ({
            winningProposal: {
              ...prevState.winningProposal,
              description: winningProposal.description,
              voteCount: winningProposal.voteCount,
            },
          }))
        }
      }

      this.setState({
        steps: [
          {
            name: "StepOne",
            component: (
              <StepOne
                accounts={this.state.accounts}
                contract={this.state.contract}
                workflowStatus={this.state.workflowStatus}
              />
            ),
          },
          {
            name: "StepTwo",
            component: (
              <StepTwo
                accounts={this.state.accounts}
                contract={this.state.contract}
                workflowStatus={this.state.workflowStatus}
              />
            ),
          },
          {
            name: "StepThree",
            component: (
              <StepThree
                accounts={this.state.accounts}
                contract={this.state.contract}
                workflowStatus={this.state.workflowStatus}
                proposals={this.state.proposals}
                hasVoted={this.state.hasVoted}
              />
            ),
          },
          {
            name: "StepFour",
            component: (
              <StepFour
                accounts={this.state.accounts}
                contract={this.state.contract}
                workflowStatus={this.state.workflowStatus}
                winningProposal={this.state.winningProposal}
              />
            ),
          },
        ],
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.error(error)
    }
  }

  startProposalsRegistering = async () => {
    const { accounts, contract } = this.state
    await contract.methods
      .startProposalsRegistering()
      .send({ from: accounts[0] })
  }

  endProposalsRegistering = async () => {
    const { accounts, contract } = this.state
    await contract.methods.endProposalsRegistering().send({ from: accounts[0] })
  }

  startVotingSession = async () => {
    const { accounts, contract } = this.state
    await contract.methods.startVotingSession().send({ from: accounts[0] })
  }

  endVotingSession = async () => {
    const { accounts, contract } = this.state
    await contract.methods.endVotingSession().send({ from: accounts[0] })
  }

  tallyVotes = async () => {
    const { accounts, contract } = this.state
    await contract.methods.tallyVotes().send({ from: accounts[0] })
  }

  newRegistrationSession = async () => {
    const { accounts, contract } = this.state
    await contract.methods.newRegistrationSession().send({ from: accounts[0] })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }

    if (this.state.isOwner) {
      return (
        <div className="App">
          <div className="flex flex-col justify-between min-h-screen">
            <div className="flex-1">
              <header>
                <nav className="bg-yellow-10 border-yellow-30  z-50 fixed w-full">
                  <div className="sm:px-6 sm:py-3 md:px-8 md:py-6 flex flex-row items-center justify-between border border-b">
                    <div className="flex flex-row items-center">
                      <a className="logo md:w-170 w-80" href="/">
                        Vote DApp
                      </a>
                    </div>
                    <div className="flex">
                      <button className="p-1 block md:hidden">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 24 24"
                          className="h-8 w-auto"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                        </svg>
                      </button>
                    </div>
                    <ul className="hidden list-none md:flex flex-row gap-4 items-baseline ml-10">
                      <li>
                        <button
                          id="web3-status-connected"
                          className="web3-button"
                        >
                          <p className="Web3StatusText">
                            {this.state.userAddress}
                          </p>
                          <div
                            size="16"
                            className="Web3Status__IconWrapper-sc-wwio5h-0 hqHdeW"
                          >
                            <div className="Identicon__StyledIdenticon-sc-1ssoit4-0 kTWLky">
                              <span>
                                <div className="avatar">
                                  <svg x="0" y="0" width="16" height="16">
                                    <rect
                                      x="0"
                                      y="0"
                                      width="16"
                                      height="16"
                                      transform="translate(-1.1699893080448718 -1.5622487594391614) rotate(255.7 8 8)"
                                      fill="#2379E1"
                                    ></rect>
                                    <rect
                                      x="0"
                                      y="0"
                                      width="16"
                                      height="16"
                                      transform="translate(4.4919645360147475 7.910549295855059) rotate(162.8 8 8)"
                                      fill="#03595E"
                                    ></rect>
                                    <rect
                                      x="0"
                                      y="0"
                                      width="16"
                                      height="16"
                                      transform="translate(11.87141302372359 2.1728091065947037) rotate(44.1 8 8)"
                                      fill="#FB1877"
                                    ></rect>
                                  </svg>
                                </div>
                              </span>
                            </div>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                </nav>
              </header>

              <div className="flex flex-col">
                <main>
                  <div className="container relative mt-7">
                    <MultiStep
                      activeStep={this.state.activeStep}
                      steps={this.state.steps}
                      showNavigation={false}
                    />

                    <h2>Admin Arera</h2>

                    <AddVoterForm
                      accounts={this.state.accounts}
                      contract={this.state.contract}
                    />
                    <button
                      className="submit-button"
                      onClick={this.startProposalsRegistering}
                    >
                      startProposalsRegistering
                    </button>
                    <button
                      className="submit-button"
                      onClick={this.endProposalsRegistering}
                    >
                      endProposalsRegistering
                    </button>
                    <button
                      className="submit-button"
                      onClick={this.startVotingSession}
                    >
                      startVotingSession
                    </button>
                    <button
                      className="submit-button"
                      onClick={this.endVotingSession}
                    >
                      endVotingSession
                    </button>
                    <button className="submit-button" onClick={this.tallyVotes}>
                      tallyVotes
                    </button>
                    <button
                      className="submit-button"
                      onClick={this.newRegistrationSession}
                    >
                      newRegistrationSession
                    </button>
                  </div>
                </main>
              </div>
            </div>
          </div>

          <footer></footer>
        </div>
      )
    }
    return (
      <div className="App">
        <div className="flex flex-col justify-between min-h-screen">
          <div className="flex-1">
            <header>
              <nav className="bg-yellow-10 border-yellow-30  z-50 fixed w-full">
                <div className="sm:px-6 sm:py-3 md:px-8 md:py-6 flex flex-row items-center justify-between border border-b">
                  <div className="flex flex-row items-center">
                    <a className="logo md:w-170 w-80" href="/">
                      Vote DApp
                    </a>
                  </div>
                  <div className="flex">
                    <button className="p-1 block md:hidden">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        className="h-8 w-auto"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                      </svg>
                    </button>
                  </div>
                  <ul className="hidden list-none md:flex flex-row gap-4 items-baseline ml-10">
                    <li>
                      <button
                        id="web3-status-connected"
                        className="web3-button"
                      >
                        <p className="Web3StatusText">
                          {this.state.userAddress}
                        </p>
                        <div
                          size="16"
                          className="Web3Status__IconWrapper-sc-wwio5h-0 hqHdeW"
                        >
                          <div className="Identicon__StyledIdenticon-sc-1ssoit4-0 kTWLky">
                            <span>
                              <div className="avatar">
                                <svg x="0" y="0" width="16" height="16">
                                  <rect
                                    x="0"
                                    y="0"
                                    width="16"
                                    height="16"
                                    transform="translate(-1.1699893080448718 -1.5622487594391614) rotate(255.7 8 8)"
                                    fill="#2379E1"
                                  ></rect>
                                  <rect
                                    x="0"
                                    y="0"
                                    width="16"
                                    height="16"
                                    transform="translate(4.4919645360147475 7.910549295855059) rotate(162.8 8 8)"
                                    fill="#03595E"
                                  ></rect>
                                  <rect
                                    x="0"
                                    y="0"
                                    width="16"
                                    height="16"
                                    transform="translate(11.87141302372359 2.1728091065947037) rotate(44.1 8 8)"
                                    fill="#FB1877"
                                  ></rect>
                                </svg>
                              </div>
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>
            </header>

            <div className="flex flex-col">
              <main>
                <div className="container relative mt-7">
                  <MultiStep
                    activeStep={this.state.activeStep}
                    steps={this.state.steps}
                    showNavigation={false}
                  />
                </div>
              </main>
            </div>
          </div>
        </div>

        <footer></footer>
      </div>
    )
  }
}

export default App
