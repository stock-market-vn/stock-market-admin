import React from "react";
import Sidebar from './../common/sidebar';

const adminLayout = (ChildComponent) => {
    class AdminLayout extends React.Component {
        constructor(props){
            super(props);
    
            this.state = {
                pageLoaded: false,
                saveLeadClickEvent: ""
            };
        }

        componentDidMount(){
            setTimeout(() => {
                this.setState(() => ({
                    pageLoaded: true
                }))
            }, 1000);
        }

        renderHtml(){
            return <div className="d-flex" id="wrapper">
                <Sidebar/>
                <div className="main" id="page-content-wrapper">
                    {/* <Header /> */}
                    <div className="container-fluid content-container">
                        <ChildComponent {...this.props} />
                    </div>
                </div>
            </div>
        }

        addLeadModalFooterContent(){ 
            return <>
                <div style={{width:"100%"}}>
                    <button onClick={(e) => this.setState(() => ({saveLeadClickEvent: (Math.random() + 1).toString(36).substring(7)}))} className="btn btn-default low-height-btn">Add Lead</button> 
                </div>
            </>;
        }

        handleParentData = (e) => {
            console.log(e);
        }

        render(){
            return <>
                {this.renderHtml()}
            </>
        }
    }

    return AdminLayout;
}

export default adminLayout;