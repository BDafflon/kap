import { useState, useEffect } from "react";

const typeRessource = (type) => {
    if (type == 0) return 'CM'
    if (type == 1) return 'TD'
    if (type == 3) return 'Devoir'
    if (type == 4) return 'Evaluation'
    if (type == 5) return 'TP/CR'
    if (type == 6) return 'Auto-Evaluation'
  
    return 'undefined'  
};

export default typeRessource;

