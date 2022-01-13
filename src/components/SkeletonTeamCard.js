import React from 'react'
import {Skeleton} from "primereact/skeleton";
import {Card} from 'primereact/card';
import '../styles/Skeleton.css';
import '../styles/Common.css';
import '../styles/TeamCard.css';

export default function SkeletonTeamCard(props) {
    React.useEffect(() => {

    });

    React.useEffect(() => {

    }, []);

    const header = (
        <img alt="Card" src="gray-add-icon.png" onClick={props.ClickFunction}
             style={{borderRadius: "50%", width: "70px", height: "70px"}}
             onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}/>
    );

    const title = (
        <div onClick={props.ClickFunction}>
            <Skeleton animation="none" shape="rectangle"/>
        </div>
    );

    const footer = (
        <span onClick={props.ClickFunction} className="p-grid flex justify-content-center align-itms-baseline">
            <Skeleton animation="none" width="40px" height="40px" shape="rectangle" className="p-col-6"/>
            <Skeleton animation="none" width="40px" height="40px" shape="rectangle" className="p-col-6 p-ml-1"/>
        </span>
    );

    return(
        <Card header={header} title={title} footer={footer}
              className="p-lg-1 p-md-2 p-sm-6 p-ml-3 shortTitle centeredFooter centeredCard p-m-2"/>

    )
}