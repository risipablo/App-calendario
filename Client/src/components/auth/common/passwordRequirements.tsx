import { Collapse } from "@mui/material";
import type { PasswordRequirementsProps } from "../../../interfaces/type.user"
import { InfoIcon } from "lucide-react";
import { TransitionGroup } from 'react-transition-group';


export const PasswordRequirements = ({
    onToggle,
    show
}:PasswordRequirementsProps) => {

    const requirements: string[] = [
        "La contraseña debe tener al menos 8 caracteres.",
        "Incluir al menos una mayúscula.",
        "Incluir al menos un número.",
        "Incluir al menos un carácter especial (opcional).",
        "No incluir espacios en blanco."
      ];

    return (
    <>
      <div 
        onClick={onToggle} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'red', 
          fontWeight: 600, 
          marginTop: '1rem', 
          cursor: 'pointer' 
        }}
        role="button"
        tabIndex={0}
        aria-expanded={!show}
      >
        <InfoIcon/>
        <p style={{ margin: 0 }}>Requisitos</p>
      </div>

      <TransitionGroup>
        {!show && 
          <Collapse>
            <ul className='p3'>
                {requirements.map((req,id) => (
                    <li key={id}> {req}</li>
                ))}
            </ul>
          </Collapse>
        }
      </TransitionGroup>
    </>
  );
}
