const ticketModel = require("../Models/ticketModel");
const agentModel = require("../Models/agentModel");
const queueModel = require("../Models/queueModel");
const cron = require('node-cron');


require('dotenv').config();



const systemController = {

  getAllOpenTickets: async (req, res) => {
    try {
    // Modify the find() method to include a condition for open tickets
     const tickets = await ticketModel.find({ status: 'open' });
          
     //return res.status(200).json({ tickets });
      return tickets
    } catch (error) {
         return res.status(500).json({ message: error.message });
    }
  },
 constructQueue : async(req ) =>{
    console.log("queue constructed");
    const combined = [];
    const high = [];
    const medium = [];
    const low =[];

    const newQ = new queueModel({
      low : low,
      medium : medium,
      high : high, 
      combined : combined
    });

    await newQ.save();
  
  },
  updateQueue: async (res , req) => {
    console.log("enter update queue");
    const openTickets = await systemController.getAllOpenTickets();
    let queue = await queueModel.findOne({});

      if(!queue){
        await systemController.constructQueue(req);
        queue = await queueModel.findOne({});
      }

      
  
    let uniqueTickets = queue.combined;
    //console.log("unique: " , uniqueTickets);
    openTickets.forEach((ticket) => {
      const ticketId = ticket._id;
     // console.log("ticket id: " , ticketId);
      const priority = ticket.priority;

     // console.log(!uniqueTickets.includes(ticketId))
      if(!uniqueTickets.includes(ticketId)) {
        queue.combined.push(ticketId);
        
  
        if(priority === 'high'){
          queue.high.push(ticketId)
        }else if (priority === 'medium') {
          queue.medium.push(ticketId)
        } else if (priority === 'low') {
          queue.low.push(ticketId);
        }
      }
    
    });
    await queue.save();
},

  assignTickets: async (req, res) => {
      try {
        console.log("enter assign ticket");
        const agent1 = await agentModel.findOne({ agentType: 'agent1' });
        const agent2 = await agentModel.findOne({ agentType: 'agent2' });
        const agent3 = await agentModel.findOne({ agentType: 'agent3' });
        await systemController.updateQueue(res , req);

        const queue = await queueModel.findOne({});
        console.log("QUEUE HIGH :" , queue.high);
        console.log("QUEUE MEDIUM :" ,queue.medium);
        console.log("QUEUE LOW: " , queue.low);
        console.log("QUEUE COMBINED: " , queue.combined);

  
        
        const ticketId = queue.combined[0];
        const ticketQ = await ticketModel.findById(ticketId);
        
        console.log(ticketQ!=null);
        if(ticketQ!=null) {
          const assignToAgent = (agent, ticket , queue , queueAll ) => {
            console.log(`${agent} agent length:`, agent.tickets.length);
            console.log(agent.tickets.length < 5);
            if (agent.tickets.length < 5) {
              ticket.status ="pending";
              ticket.agentId = agent._id;
              agent.tickets.push(ticket);
              queue.shift();
              queueAll.shift();
              return true;
            }
            return false;
  
            
          };
  
          
           if (ticketQ.type === 'Software' && ticketQ.priority === 'high') {
              console.log("SOFTWARE AND HIGH");
              if(agent1!=null) {
                assignToAgent( agent1, ticketQ , queue.high , queue.combined);
              }
            } else if (ticketQ.type === 'Hardware' && ticketQ.priority === 'high') {
              console.log("Hardware AND HIGH");
              if(agent2!=null) {
                assignToAgent( agent2, ticketQ, queue.high , queue.combined);
              }
            } else if (ticketQ.type === 'Networks' && ticketQ.priority === 'high') {
              console.log("NETWORKS AND HIGH");
              if(agent3!=null) {
                assignToAgent( agent3, ticketQ, queue.high , queue.combined);
              }
            }
         
      
           
            if (ticketQ.type === 'Software' && ticketQ.priority === 'medium') {
              if(agent1!=null) {
                if(assignToAgent(agent1, ticketQ , queue.medium , queue.combined) ===false){
                  console.log("11111111");
                  if(agent2!=null) {
                    assignToAgent(agent2, ticketQ , queue.medium , queue.combined);
                  }
                }
              }
  
            } else if (ticketQ.type === 'Hardware' && ticketQ.priority === 'medium') {  // 2, 3
              if(agent2!=null) {
                if(assignToAgent(agent2, ticketQ , queue.medium , queue.combined) ===false){
                  console.log("2222222222222");
                  if(agent3!=null) {
                    assignToAgent(agent3, ticketQ , queue.medium , queue.combined);
                  }
                }
              }
            } else if (ticketQ.type === 'Networks' && ticketQ.priority === 'medium') { // 3 , 1 
              if(agent3!=null) {
                if(assignToAgent(agent3, ticketQ , queue.medium , queue.combined) === false){
                  console.log("333333333333333")
                  if(agent1!=null) {
                    assignToAgent(agent1, ticketQ , queue.medium , queue.combined);
                  }
                }
              }
            }
          
            
            
            if (ticketQ.type === 'Software' && ticketQ.priority === 'low') {  // 1 , 3
              if(agent1!=null) {
                if(assignToAgent(agent1, ticketQ , queue.low , queue.combined) ===false){
                  console.log("444444444444444444");
                  if(agent3!=null) {
                    assignToAgent(agent3, ticketQ , queue.low , queue.combined);
                  }
                }
              }
            } else if (ticketQ.type === 'Hardware' && ticketQ.priority === 'low') {  //2 , 1 
              if(agent2!=null) {
                if(assignToAgent(agent2, ticketQ , queue.low , queue.combined) ===false){
                  console.log("5555555555555");
                  if(agent1!=null) {
                    assignToAgent(agent1, ticketQ , queue.low , queue.combined);
                  }
                }
              }
            } else if (ticketQ.type === 'Networks' && ticketQ.priority === 'low') {  // 3, 2 
              if(agent3!=null) {
                if(assignToAgent(agent3, ticketQ , queue.low , queue.combined) ===false){
                  console.log("6666666666666666");
                  if(agent2!=null) {
                    assignToAgent(agent2, ticketQ , queue.low , queue.combined);
                  }
                }
              }
            }
      
         if(agent1!=null) {
          agent1.save();
         } 
         if(agent2!=null) {
          agent2.save();
         } 
         if(agent3!=null) {
          agent3.save();
         } 
         queue.save(); 
         ticketQ.save();
  
        }
        console.log("after if");
        
        setInterval(async () => {
          try {
              console.log("finished ");
              // if (agent1.tickets.length === 5 && agent2.tickets.length === 5 && agent3.tickets.length === 5) {
              //     console.log("all our agents are busy rn working on other tickets");
              //     // res.status(200).json({ message: 'All agents are busy right now', result });
              // } else
               if (queue.combined.length > 0) {
                  await systemController.assignTickets();
                  console.log('assignTickets function executed successfully.');
              } else {
                //  clearInterval(intervalId);
                console.log("Assigned tickets successfully, no more tickets to assign");
                  // res.status(200).json({ message: 'Assigned tickets successfully, no more tickets to assign', result });
              }
          } catch (err) {
              console.error('Error in interval job:', err);
          }
      }, 60000 * 4);
    
       
      } catch (error) {
        // Handle errors
        console.error('Error assigning tickets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
   },

    
  
  

};
module.exports =systemController;
