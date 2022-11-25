import React from "react";
const authLayout = (ChildComponent) => {
    class AuthLayout extends React.Component {
        constructor(props){
            super(props);
    
            this.state = {};
        }

        render(){
            return <>
            <section className="vh-100">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-5">
                            <img alt="hey" src={require("../assets/images/left_logo.png")} className="img-fluid"/>
                        </div>
                        <div className="col-7">
                            <ChildComponent {...this.props} />
                        </div>
                    </div>
                </div>
            </section>
        </>
        }
    }

    return AuthLayout;
}

export default authLayout;