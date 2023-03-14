import { useRef, useState } from "react";
import { VALUE_SYMBOL } from "./Consts";
import { ErrorAlert } from "./Alert";


function Calculator(){
  const startAmount = useRef();
  const percentage = useRef();
  const additionalPayments = useRef();
  const months = useRef();

  const [hasError, setHasError] = useState(true);
  const [totalEarned, setTotalEarned] = useState(0);

  function validate(){
    // TODO: refactor.
    if (
      isNaN(parseFloat(startAmount.current.value)) || 
      parseFloat(startAmount.current.value) < 1
    ) return false;
    if (
      isNaN(parseFloat(percentage.current.value)) || 
      parseFloat(percentage.current.value) < 1
    ) return false;
    if (
      isNaN(parseFloat(additionalPayments.current.value)) || 
      parseFloat(additionalPayments.current.value) < 1
    ) return false;
    if (
      isNaN(parseFloat(months.current.value)) || 
      parseFloat(months.current.value) < 1
    ) return false;
    return true;
  }

  function calculatePercentage(value){
    return value / 100 * (parseFloat(percentage.current.value) / 12);
  }

  function calculateFor(forMonthIndex){
    let currentTotalEarned = parseFloat(startAmount.current.value);
    for(let monthIndex = 0; monthIndex < forMonthIndex; monthIndex ++){

        // Percentage calculation.
        currentTotalEarned += calculatePercentage(currentTotalEarned);

        // Additional payment for this month.
        currentTotalEarned += parseFloat(additionalPayments.current.value);
    }
    
    return currentTotalEarned;
  }

  function recalculate(){
    if (!validate()){
      setHasError(true);
      return;
    }
    setHasError(false);

    // Calculation.
    let currentTotalEarned = parseFloat(startAmount.current.value);
    for(let monthIndex = 0; monthIndex < parseFloat(months.current.value); monthIndex ++){

        // Percentage calculation.
        currentTotalEarned += currentTotalEarned / 100 * (parseFloat(percentage.current.value) / 12);

        // Additional payment for this month.
        currentTotalEarned += parseFloat(additionalPayments.current.value);
    }

    setTotalEarned(currentTotalEarned);
  }

  const paymentsTotal = parseFloat(additionalPayments.current.value) * parseFloat(months.current.value)
  return (
    <div >
        Начальная сумма: <input ref={startAmount} type="number" min={1} placeholder={`10${VALUE_SYMBOL}`}/>
        <br/>
        Процентная ставка: <input ref={percentage} type="number" min={1} placeholder={"% годовых"}/>
        <br/>
        Дополнительные пополнения: <input ref={additionalPayments} type="number" min={1} placeholder={`${VALUE_SYMBOL} раз в месяц`}/>
        <br/>
        Срок расчёта: <input ref={months} placeholder={"1"}/>
        <select disabled>
          <option value="byMonths">Месяцев</option>
          <option value="byYears">Лет</option>
        </select>

        <br/>
        <button onClick={recalculate}>Вычислить доход</button>

        <hr/>
        {hasError && <ErrorAlert/>}
        {!hasError && <>
          На балансе через {months.current?.value || 1} месяца(ев): 
          <span style={{color: "green"}}> +{Math.floor(totalEarned)}</span> 
          {" "}(
            Проценты: <span className={"topup"}>+{Math.floor(totalEarned) - paymentsTotal}, </span>
            пополнения: <span className={"topup"}>+{paymentsTotal}</span>)
          <br/>
            Доход по месяцам:
            {Array.from(Array(parseFloat(months.current.value)), (e, i) => {
                const onStart = calculateFor(i);
                const onEnd = calculateFor(i + 1);
                const percentsEarned = Math.floor(calculatePercentage(onStart));
                const paymentsEarned = additionalPayments.current?.value || 0;
                return <li key={i}>Месяц {i + 1}: 
                    <br/>Проценты: <span className="topup">{percentsEarned}</span>
                    <br/>Пополнения: <span className="topup">+{paymentsEarned}</span>
                    <br/>В начале месяца: <span className="balance">{Math.floor(onStart)}</span>
                    <br/>В конце месяца: <span className="balance">{Math.floor(onEnd)}</span>
                </li>
            })}
        </>}
       

    </div>
  );
}

export default Calculator;