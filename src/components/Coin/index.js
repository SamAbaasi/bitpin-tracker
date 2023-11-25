import './Coin.scss'
const formatNumber = (value) => {
  if (value === undefined) {
    return "0";
  }
  return value.toLocaleString();
};

const Coin = ({ coin }) => {
  const { title_fa, code, currency1, price } = coin;
  return (
    <tr className="coin-row">
      <td className="coin-price">${formatNumber(price)}</td>
      <td>
        <div className="coin-details">
          {currency1?.image ? (
            <img alt="coin icon" className="coin-image" src={currency1?.image} />
          ) : (
            <div></div>
          )}
          <span className="coin-name">{title_fa}</span>
          <span className="coin-code">{code}</span>
        </div>
      </td>
    </tr>
  );
};

export default Coin;