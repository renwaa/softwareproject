import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom'; 
import '../stylesheets/manager.css';
import AppNavBarAdmin from '../components/navBarAdmin';
import { useCustomization } from "../contexts/CustomizationContext";




const backend_url = "http://localhost:3000/api/v1";

export default function analyticsPage() {
    const { customization, updateCustomization } = useCustomization();
    const [analyticsData, setAnalyticsData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAnalyticsData() {
            try {
                const response = await axios.get(`${backend_url}/analytics`, { withCredentials: true });
                setAnalyticsData(response.data);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        }

        fetchAnalyticsData();
    }, []);

    if (!analyticsData) {
        return <p>Loading...</p>;
    }

    // Prepare data for Ticket Status Bar Chart
    const ticketStatusData = [
        { name: 'Open', count: analyticsData.ticketStatusAnalytics.open },
        { name: 'Pending', count: analyticsData.ticketStatusAnalytics.pending },
        { name: 'Closed', count: analyticsData.ticketStatusAnalytics.closed }
    ];

    // Prepare data for Ticket Priority Line Chart
    const ticketPriorityData = [
        { name: 'High', count: analyticsData.ticketPriorityAnalytics.high },
        { name: 'Medium', count: analyticsData.ticketPriorityAnalytics.medium },
        { name: 'Low', count: analyticsData.ticketPriorityAnalytics.low }
    ];

    // Prepare data for Ticket Type Pie Chart
    const ticketTypeData = [
        { name: 'Software', count: analyticsData.ticketTypeAnalytics.software },
        { name: 'Hardware', count: analyticsData.ticketTypeAnalytics.hardware },
        { name: 'Networks', count: analyticsData.ticketTypeAnalytics.networks }
    ];

    return (
        < div style={{ 
            backgroundColor: customization.backgroundColor, 
            color: customization.fontColor, 
            fontSize: `${customization.fontSize} px`,
            minHeight: '100vh'
        }}
        >
             <AppNavBarAdmin />
            <Container>
             

                <h2>Ticket Status Analytics</h2>
                <BarChart width={600} height={300} data={ticketStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>

                <h2>Ticket Priority Analytics</h2>
                <LineChart width={600} height={300} data={ticketPriorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                </LineChart>

                <h2>Ticket Type Analytics</h2>
                <PieChart width={600} height={300}>
                    <Pie
                        data={ticketTypeData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {
                            ticketTypeData.map((entry, index) => {
                                let fillColor;
                                if (entry.name === 'Networks') {
                                    fillColor = '#808080'; // Grey color for Networks
                                } else {
                                    // Other colors for different slices
                                    fillColor = ["#8884d8", "#82ca9d"][index % 2];
                                }
                                return <Cell key={`cell-${index}`} fill={fillColor} />;
                            })
                        }
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>

                {/* Additional charts can be added here */}
            </Container>
        </div>
    );
}
