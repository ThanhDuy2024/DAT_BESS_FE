import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { mockEnergyReport } from "../../data/mockData";
const GRID_PRICE = 2500;
const FIT_PRICE = 1943;
const CO2_FACTOR = 0.52;

const formatMoney = (value, locale) => {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

const EconomicBenefitCard = () => {
  const lang = useIntl();
  const stats = useMemo(() => {
    const totalDischarge = mockEnergyReport.reduce((s, r) => s + r.discharge, 0);
    const totalPV = mockEnergyReport.reduce((s, r) => s + r.pv, 0);
    const revenue = totalDischarge * GRID_PRICE + totalPV * FIT_PRICE;
    const co2 = (totalDischarge + totalPV) * CO2_FACTOR;
    return { revenue, co2 };
  }, []);

  const items = [
    {
      icon: <img src="/img/piggy-bank.png" alt="Piggy bank"   />,
      label: lang.formatMessage({ id: "dashboard_economic_revenue" }),
      value: formatMoney(stats.revenue, lang.locale),
      unit: "VND",
      bg: "rgba(220, 252, 231, 1)",
    },
    {
      icon: <img src="/img/co2.png" alt="CO2" />,
      label: lang.formatMessage({ id: "dashboard_economic_co2" }),
      value: (stats.co2 / 1000).toFixed(1),
      unit: lang.formatMessage({ id: "dashboard_economic_tons" }),
      bg: "rgba(209, 250, 229, 1)",
    },
  ];

  return (
    <div className="DAT_Economic_Card">
      <div className="DAT_Economic_Card_Header">
        <div>
          <span className="DAT_Economic_Card_Header_Title">
            {lang.formatMessage({ id: "dashboard_economic_title" })}
          </span>
        </div>
      </div>
      <div className="DAT_Economic_Card_Grid">
        {items.map((item, index) => (
          <div className="DAT_Economic_Card_Grid_Item" key={index}>
            <div
              className="DAT_Economic_Card_Grid_Item_Icon"
              style={{ background: item.bg }}
            >
              {item.icon}
            </div>
            <div className="DAT_Economic_Card_Grid_Item_Body">
              <div className="DAT_Economic_Card_Grid_Item_Body_Label">{item.label}</div>
              <div
                className="DAT_Economic_Card_Grid_Item_Body_Value">
                <div className="DAT_Economic_Card_Grid_Item_Body_Value_Val">{item.value}</div>
                <div className="DAT_Economic_Card_Grid_Item_Body_Value_Unit">{item.unit}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EconomicBenefitCard;
