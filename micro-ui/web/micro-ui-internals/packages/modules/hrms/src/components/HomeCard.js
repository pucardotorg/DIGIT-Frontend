import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

/**
 * HomeCard
 *
 * This component is rendered by DIGIT core when "Home" module is in enabledModules.
 * DIGIT core looks for components named {ModuleCode}Card.
 *
 * We use this to redirect from /employee to /employee/home.
 */
const HomeCard = () => {
  const history = useHistory();

  useEffect(() => {
    const contextPath = window?.contextPath || "workbench-ui";
    const currentPath = history.location.pathname;

    // Only redirect if we're on the base /employee page
    if (currentPath === `/${contextPath}/employee`) {
      history.replace(`/${contextPath}/employee/home`);
    }
  }, [history]);

  // Return null so this card doesn't render anything visible
  return null;
};

export default HomeCard;
