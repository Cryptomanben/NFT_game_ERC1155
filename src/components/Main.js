import { ethers } from "ethers"
import { useRef } from "react"
import dai from '../dai.png'

const Main = ({ daiTokenBalance, pointsBalance, stakingBalance, stakeTokens, unstakeTokens }) => {
  const input = useRef(null);
  return (
    <div id="content" className="mt-3">

      

      <div className="card mb-4" >

        <div className="card-body">

          <form className="mb-3" onSubmit={(event) => {
            event.preventDefault()
            let amount
            console.log(input)
            amount = input.current.value.toString()
            amount = ethers.utils.parseUnits(amount, 'ether')
            stakeTokens(amount)
          }}>
            <div>
              <label className="float-left"><b>Stake Tokens</b></label>
              <span className="float-end">
                Balance: {ethers.utils.formatUnits(daiTokenBalance, 'ether')}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="number"
                ref={input}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={dai} height='32' alt="" />
                  &nbsp;&nbsp;&nbsp; mDAI
                </div>
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
            </div>
          </form>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault()
                unstakeTokens()
              }}>
              UN-STAKE...
            </button>
          </div>
        </div>
      </div>
      <table className="table table-borderless text-muted text-center">
        <thead>
          <tr>
            <th scope="col">Staking Balance</th>
            <th scope="col">Points Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ethers.utils.formatUnits(stakingBalance, 'ether')} mDAI</td>
            <td>{pointsBalance} points</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

}

export default Main;
