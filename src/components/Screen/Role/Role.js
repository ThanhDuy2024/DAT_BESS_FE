import React from 'react'
import './Role.scss'
import { useIntl } from 'react-intl';
import { LuSettings } from 'react-icons/lu';
export default function Role() {
  const lang = useIntl();
  return (
    <>
      <div className="DAT_RoleSetting">
        <div className="DAT_RoleSetting_HeaderCard">
          <div className="DAT_RoleSetting_HeaderCard_Main">
            <div className="DAT_RoleSetting_HeaderCard_Main_Icon">
              <LuSettings size={25} />
            </div>
            <div className="DAT_RoleSetting_HeaderCard_Main_Title">
              {lang.formatMessage({ id: "role_management" })}
            </div>
          </div>
          <div className=''>This is add button and search</div>
        </div>
      </div>
    </>
  )
}
