import React from 'react';
import {Menubar} from 'primereact/menubar';
import {TieredMenu} from 'primereact/tieredmenu';
import '../styles/Menu.css';
import logo from '../img/logo.svg';
import ls from 'local-storage';
import {
    withRouter,
    useHistory
} from 'react-router-dom';

function Menu(props) {
    const histor = useHistory();

    const handleClick = (e) => {
        ls.set('token', '');
        ls.set('username', '');
        ls.set('role_id', 0);
        ls.set('active', 0);
        ls.set('authSucc', false);
        ls.set('dataLoad', false);
        window.location.reload();
    }

    const [items, setItems] = React.useState([
        /*        {
                    icon: 'pi pi-fw pi-cog',
                    command: (e) => {
                        props.history.push("/administration");
                    }
                },*/
        {
            label: 'Acasa',
            icon: 'pi pi-fw pi-calendar',
            command: (e) => {
                props.history.push("/home");
            }
        },
        {
            label: 'Echipa',
            icon: 'fas fa-futbol',
            items: [
                {
                    label: 'Jucatori',
                    icon: 'pi pi-fw pi-user',
                    command: (e) => {
                        props.history.push("/player");
                    }
                },
                {
                    label: 'Formatie',
                    icon: 'fas fa-sitemap',
                    command: (e) => {
                        props.history.push("/formation");
                    }
                },
                {
                    label: 'Schite',
                    icon: 'fas fa-tablet-alt',
                    command: (e) => {
                        props.history.push("/drawboard");
                    }
                }
            ]
        },
        {
            label: 'Istoric',
            icon: 'fas fa-history',
            command: (e) => {
                props.history.push("/history");
            }

        },
        {
            label: 'Analiza',
            icon: 'far fa-chart-bar',
            command: (e) => {
                props.history.push("/analitics");
            }
        },
        {
            label: 'Profil',
            icon: 'fas fa-user-alt',
            command: (e) => {
                props.history.push("/profil");
            }
        },
        {
            label: 'Deconectare',
            icon: 'pi pi-fw pi-power-off',
            command: handleClick
        }
    ]);

    const [items_left, setItems_left] = React.useState([
        {
            icon: 'pi pi-fw pi-calendar',
            command: (e) => {
                props.history.push("/home");
            }
        },
        {
            icon: 'fas fa-futbol',
            items: [
                {
                    label: 'Jucatori',
                    icon: 'pi pi-fw pi-user',
                    command: (e) => {
                        props.history.push("/player");
                    }
                },
                {
                    label: 'Formatie',
                    icon: 'fas fa-sitemap',
                    command: (e) => {
                        props.history.push("/formation");
                    }
                },
                {
                    label: 'Schite',
                    icon: 'fas fa-tablet-alt',
                    command: (e) => {
                        props.history.push("/drawboard");
                    }
                }
            ]
        },
        {
            icon: 'fas fa-history',
            items:
                [
                    {
                        label: 'Documente',
                        icon: 'pi pi-file-o',
                        command: (e) => {
                            props.history.push("/history");
                        }
                    },
                    {
                        label: 'Statistici',
                        icon: 'pi pi-chart-bar',
                        command: (e) => {
                            props.history.push("/statistics");
                        }
                    }
                ]
        },
        {
            icon: 'far fa-chart-bar',
            command: (e) => {
                props.history.push("/analitics");
            }

        }
    ]);


    React.useEffect(() => {
        if (ls.get('role_id') == 5 || ls.get('role_id') == 4) {
            setItems([{
                label: 'Administrare',
                icon: 'pi pi-fw pi-cog',
                command: (e) => {
                    props.history.push("/administration");
                }
            },...items]);
            setItems_left([{
                icon: 'pi pi-fw pi-cog',
                command: (e) => {
                    props.history.push("/administration");
                }
            },...items_left]);
        }
    }, []);


    const Logo = (<span><img alt="logo" src={logo}/><h2>SoccerTracker</h2></span>);
    return (
        <React.Fragment>
            <Menubar id="up_menu" className="up-menu" model={items} start={Logo}/>
            <TieredMenu id="pr_id_1" className="left-menu" model={items_left}/>

        </React.Fragment>
    );

}

export default withRouter(Menu);