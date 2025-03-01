import React from "react";
// import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import './Dashboard.css'

const Dashboard = () => {
    return (
        <>
            <PowerBIEmbed
                embedConfig={{
                    type: "report",
                    id: "a2412c11-ec3c-48fe-adaf-b1511d837ddf",
                    embedUrl:
                        "https://app.powerbi.com/reportEmbed?reportId=a2412c11-ec3c-48fe-adaf-b1511d837ddf&groupId=88112a4d-ce8c-4d69-b4bd-2422b2a3b200&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1DLVBSSU1BUlktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d",
                    accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayIsImtpZCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZDFmMTQzNDgtZjFiNS00YTA5LWFjOTktN2ViZjIxM2NiYzgxLyIsImlhdCI6MTczOTgyOTEzOSwibmJmIjoxNzM5ODI5MTM5LCJleHAiOjE3Mzk4MzQ4MTEsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84WkFBQUFFdk0yYXA1UTE5SmdvZ1ZKNnFvSS9RcTduZGxZcm8xMFhWWGVySnFmT3hGMytqU1hyVll4TFZZbWVIS2ZYTDR6IiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjIzZDhmNmJkLTFlYjAtNGNjMi1hMDhjLTdiZjUyNWM2N2JjZCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiSkFJTiIsImdpdmVuX25hbWUiOiJLVVNIIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMjQwOTo0MDgxOmFiMDM6NDJlYToxNjI6M2I4MDphYzVhOmE3NzgiLCJuYW1lIjoiS1VTSCBKQUlOIC0gNjAwMDQyMjAyMzAiLCJvaWQiOiI2N2YwNzA0MS05N2Q4LTQ0YmMtOTY2ZC1kMTBiY2RlYjczZDgiLCJwdWlkIjoiMTAwMzIwMDI3MjZFRTIxNiIsInJoIjoiMS5BVDBBU0VQeDBiWHhDVXFzbVg2X0lUeThnUWtBQUFBQUFBQUF3QUFBQUFBQUFBQTlBSmM5QUEuIiwic2NwIjoiQXBwLlJlYWQuQWxsIENhcGFjaXR5LlJlYWQuQWxsIENhcGFjaXR5LlJlYWRXcml0ZS5BbGwgQ29udGVudC5DcmVhdGUgRGFzaGJvYXJkLlJlYWQuQWxsIERhc2hib2FyZC5SZWFkV3JpdGUuQWxsIERhdGFmbG93LlJlYWQuQWxsIERhdGFmbG93LlJlYWRXcml0ZS5BbGwgRGF0YXNldC5SZWFkLkFsbCBEYXRhc2V0LlJlYWRXcml0ZS5BbGwgR2F0ZXdheS5SZWFkLkFsbCBHYXRld2F5LlJlYWRXcml0ZS5BbGwgUGlwZWxpbmUuRGVwbG95IFBpcGVsaW5lLlJlYWQuQWxsIFBpcGVsaW5lLlJlYWRXcml0ZS5BbGwgUmVwb3J0LlJlYWQuQWxsIFJlcG9ydC5SZWFkV3JpdGUuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWQuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWRXcml0ZS5BbGwgVGVuYW50LlJlYWQuQWxsIFRlbmFudC5SZWFkV3JpdGUuQWxsIFVzZXJTdGF0ZS5SZWFkV3JpdGUuQWxsIFdvcmtzcGFjZS5SZWFkLkFsbCBXb3Jrc3BhY2UuUmVhZFdyaXRlLkFsbCIsInNpZCI6IjAwMjEyNDc5LWM0M2UtOGJhZC1lNTZkLTEyYzVhNjU5Y2IwYyIsInN1YiI6IkRlNmZhOVZoQ1ZISmVXeUFYeDR0aTlnUjVweUI5ZExYOS1MSGFmLV9YQ0kiLCJ0aWQiOiJkMWYxNDM0OC1mMWI1LTRhMDktYWM5OS03ZWJmMjEzY2JjODEiLCJ1bmlxdWVfbmFtZSI6IktVU0guSkFJTjIzMEBzdmttbXVtYmFpLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6IktVU0guSkFJTjIzMEBzdmttbXVtYmFpLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IkZVandIUXQtejBxd3YxN2g0dFlHQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIyOCAxIn0.cYUr2dk6KsahJ2kfLQC2ivNXCi3GGYnSzw7M2TJG1cTUcyV155uLs3VZEuVFST1wQvasO54NLH9yTyOnMiVD3bCqXTDngNlzJ9YgAmIM7Vc6KzCPnpOTFnHVTbWmMH5V-EkpuOwd2YyjVjUUspntzydBLx4kqPQa8_z8cknprJO3XVVsLM_BvYx7kgPf9Ef78NJwfWGSD5-MNCoeZYp-3JhfKowj6GwmIyszI9eEvh55voic0EPPJ_y0HQdqkpEtMmn37vCTBGdKBJK65EG1sc21W96EieQ0mDzO_hvjk1WciyPmMYG4KvNrPlru7nE8JhjNoNY1n0c_vXzyZj795g",
                    tokenType: models.TokenType.Aad,
                    settings: {
                        panes: {
                            filters: {
                                expanded: false,
                                visible: false,
                            },
                        },
                    },
                }}
                eventHandlers={
                    new Map([
                        [
                            "loaded",
                            function () {
                                console.log("Report loaded");
                            },
                        ],
                        [
                            "rendered",
                            function () {
                                console.log("Report rendered");
                            },
                        ],
                        [
                            "error",
                            function (event) {
                                console.log(event.detail);
                            },
                        ],
                        ["visualClicked", () => console.log("visual clicked")],
                        ["pageChanged", (event) => console.log(event)],
                    ])
                }
                cssClassName={"Embed-container"}
                getEmbeddedComponent={(embeddedReport) => {
                    window.report = embeddedReport;
                }}
            />
        </>
    );
};

export default Dashboard;