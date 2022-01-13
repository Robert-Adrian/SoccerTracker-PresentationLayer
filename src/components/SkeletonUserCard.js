import React from 'react'
import {Skeleton} from "primereact/skeleton";
import {Card} from 'primereact/card';
import '../styles/Skeleton.css';
import '../styles/Common.css';
import '../styles/UserCard.css';

export default function SkeletonUserCard(props) {
    React.useEffect(() => {

    });

    React.useEffect(() => {

    }, []);

    const header = (
        <img alt="Card" src="gray-add-icon.png" onClick={props.ClickFunction}
             style={{borderRadius: "50%", width: "50%", height: "50%"}}
             onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}/>

    );

    const title = (
        <div onClick={props.ClickFunction}>
            <Skeleton animation="none" shape="rectangle"/>
        </div>
    );

    const subtitle = (
        <div onClick={props.ClickFunction}>
            <Skeleton animation="none" shape="rectangle"/>
        </div>
    );

    const footer = (
        <div onClick={props.ClickFunction}>
            <Skeleton animation="none" width="80%" height="40px" shape="rectangle" className="p-col-8 p-mb-2"/>
            <Skeleton animation="none" width="80%" height="40px" shape="rectangle" className="p-col-8 p-mb-2"/>
            <Skeleton animation="none" width="80%" height="40px" shape="rectangle" className="p-col-8"/>
        </div>
    );
    return (
        <Card header={header} title={title} subTitle={subtitle} footer={footer}
              className="ui-g-12 p-lg-2 p-md-4 p-sm-12 p-ml-3 shortTitle centeredFooter centeredCard p-m-2"/>
    )
}