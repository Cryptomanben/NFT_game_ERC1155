
import farmer from '../farmer.png'

const Navbar = ({ web3Handler, account }) => {
    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a
                className="navbar-brand col-sm-3 col-md-2 mr-0 mx-3"
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
            >
              <img src={farmer} width="30" height="30" className="d-inline-block align-top" alt="" />
              &nbsp; NFTFarm
            </a>

            {account ? (
                <a
                    href={`https://etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button nav-button btn-sm mx-4">
                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                </a>
            ) : (
                <button onClick={web3Handler} className="button nav-button btn-sm mx-4">Connect Wallet</button>
            )}
        </nav>
    );
}

export default Navbar;

