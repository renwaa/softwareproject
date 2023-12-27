import React from 'react';
import "../stylesheets/button.css"; // Use relative path to access the stylesheets directory

export default function BigButtonPage() {

    return (
        <div className="big-button-page">
          <div className="buttons-container">
            <a href="http://localhost:5173/customize" className="support-button chat">
              <div className="button-content">
                <svg className="icon" viewBox="0 0 72 72">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="brush"><path d="M2.763 13.563c-1.515 1.488-.235 3.016-2.247 5.279-.908 1.023 3.738.711 6.039-1.551.977-.961.701-2.359-.346-3.389-1.047-1.028-2.47-1.3-3.446-.339zM19.539.659C18.763-.105 10.16 6.788 7.6 9.305c-1.271 1.25-1.695 1.92-2.084 2.42-.17.219.055.285.154.336.504.258.856.496 1.311.943.456.447.699.793.959 1.289.053.098.121.318.342.152.51-.383 1.191-.801 2.462-2.049C13.305 9.88 20.317 1.422 19.539.659z"></path></svg>                </svg>
                <div className="text-content">
                  <h3>Customize</h3>
                  <p>Change the look of the website to match different organizations!</p>
                </div>
              </div>
            </a>
            <a href="http://localhost:5173/setRole" className="support-button ticket">
              <div className="button-content">
                <svg className="icon" viewBox="0 0 72 72">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="role"><path d="M18 5V1h-4v4H6v26h20V5h-8zm-2-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm8 27H8V7h6v2h4V7h6v22z"></path><path d="M16 11c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm-4 4a2 2 0 0 0-2 2v2h12v-2a2 2 0 0 0-2-2h-8z"></path></svg>                </svg>
                <h3>Set Role</h3>
                <p>Change the role of any user you want.</p>
              </div>
            </a>
          </div>
        </div>
      );
}
