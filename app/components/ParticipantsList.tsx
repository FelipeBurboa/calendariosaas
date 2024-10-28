"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const ParticipantsList = ({ participants }: { participants: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getParticipantDisplay = (participant: any) => {
    return participant.name || participant.email || "Participante Desconocido";
  };

  const firstParticipant =
    participants && participants.length > 0
      ? getParticipantDisplay(participants[0])
      : "No hay participantes";

  if (participants.length <= 1) {
    return (
      <p className="text-sm text-muted-foreground">Tú y {firstParticipant}</p>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>Tú y {firstParticipant}</span>
        {isOpen ? (
          <ChevronUp className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-32 overflow-y-auto rounded-md bg-background border shadow-lg">
          <div className="py-1">
            {participants.map((participant, index) => (
              <div
                key={index}
                className="px-3 py-1 text-sm hover:bg-muted cursor-default"
              >
                {getParticipantDisplay(participant)}
                {participant.status && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({participant.status})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
