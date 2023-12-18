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
    // await queueModel.updateOne({_id : queueId} , newQueue);
    // const populatedQueue = await queueModel.findById(queueId)
    // .populate('low')
    // .populate('medium')
    // .populate('high')
    // .populate('all');

    // await populatedQueue.save();

  // Respond to the client (assuming you're using Express)
   //return res.status(200).json({ message: 'Tickets saved to queue successfully', populatedQueue });
},

  assignTickets: async (req, res) => {
      try {
        // Agent models are queried from the database
        const agent1 = await agentModel.findOne({ agentType: 'agent1' });
        const agent2 = await agentModel.findOne({ agentType: 'agent2' });
        const agent3 = await agentModel.findOne({ agentType: 'agent3' });
        await systemController.updateQueue(res , req);

        const queue = await queueModel.findOne({});
        console.log("QUEUE HIGH :" , queue.high);
        console.log("QUEUE MEDIUM :" ,queue.medium);
        console.log("QUEUE LOW: " , queue.low);
        console.log("QUEUE COMBINED: " , queue.combined);


        //return res.status(200).json({ queue});

  
        
        const ticketId = queue.combined[0];
        const ticketQ = await ticketModel.findById(ticketId);
        

        const assignToAgent = (agent, ticket , queue , queueAll ) => {
          console.log(`${agent} agent length:`, agent.tickets.length);
          console.log(agent.tickets.length < 3);
          if (agent.tickets.length < 3) {
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
            assignToAgent( agent1, ticketQ , queue.high , queue.combined);
          } else if (ticketQ.type === 'Hardware' && ticketQ.priority === 'high') {
            console.log("Hardware AND HIGH");
            assignToAgent( agent2, ticketQ, queue.high , queue.combined);
          } else if (ticketQ.type === 'Networks' && ticketQ.priority === 'high') {
            console.log("NETWORKS AND HIGH");
            assignToAgent( agent3, ticketQ, queue.high , queue.combined);
          }
       
    
         
          if (ticketQ.type === 'Software' && ticketQ.priority === 'medium') {
            if(assignToAgent(agent1, ticketQ , queue.medium , queue.combined) ===false){
              console.log("11111111");
              assignToAgent(agent2, ticketQ , queue.medium , queue.combined);
            }

          } else if (ticketQ.type === 'Hardware' && ticketQ.priority === 'medium') {  // 2, 3
            if(assignToAgent(agent2, ticketQ , queue.medium , queue.combined) ===false){
              console.log("2222222222222");
              assignToAgent(agent3, ticketQ , queue.medium , queue.combined);
            }
          } else if (ticketQ.type === 'Networks' && ticketQ.priority === 'medium') { // 3 , 1 
            if(assignToAgent(agent3, ticketQ , queue.medium , queue.combined) === false){
              console.log("333333333333333")
              assignToAgent(agent1, ticketQ , queue.medium , queue.combined);
            }
          }
        
          
          
          if (ticketQ.type === 'Software' && ticketQ.priority === 'low') {  // 1 , 3
            if(assignToAgent(agent1, ticketQ , queue.low , queue.combined) ===false){
              console.log("444444444444444444");
              assignToAgent(agent3, ticketQ , queue.low , queue.combined);
            }
          } else if (ticketQ.type === 'Hardware' && ticketQ.priority === 'low') {  //2 , 1 
            if(assignToAgent(agent2, ticketQ , queue.low , queue.combined) ===false){
              console.log("5555555555555");
              assignToAgent(agent1, ticketQ , queue.low , queue.combined);
            }
          } else if (ticketQ.type === 'Networks' && ticketQ.priority === 'low') {  // 3, 2 
            if(assignToAgent(agent3, ticketQ , queue.low , queue.combined) ===false){
              console.log("6666666666666666");
              assignToAgent(agent2, ticketQ , queue.low , queue.combined);
            }
          }
    
        // Respond with the status of queue in the JSON format
       agent1.save(); 
       agent2.save(); 
       agent3.save(); 
       queue.save(); 
       ticketQ.save();

        const result = { queue, agent1, agent2, agent3 };
        //res.status(200).json({ message: 'Assigned tickets successfully , no more tickets to assign', result });

        let intervalId = setInterval(async () => {
          try {
              console.log("finished ")
              if (agent1.tickets.length === 3 && agent2.tickets.length === 3 && agent3.tickets.length === 3) {
                 clearInterval(intervalId);
                  res.status(200).json({ message: 'All agents are busy right now', result });
              } else if (queue.combined.length > 0) {
                  await systemController.assignTickets();
                  console.log('assignTickets function executed successfully.');
              } else {
                 clearInterval(intervalId);
                  res.status(200).json({ message: 'Assigned tickets successfully, no more tickets to assign', result });
              }
          } catch (err) {
              console.error('Error in interval job:', err);
          }
      }, 60000 * 3);

        // cron.schedule('* * * * *', async () => {
          
        //     try {
        //       if(agent1.tickets.length === 3 && agent2.tickets.length === 3 && agent3.tickets.length === 3) {
        //         res.status(200).json({ message: 'all agents are busy right now', result });
        //       } else if(queue.combined.length > 0){
        //         await systemController.assignTickets();
        //         console.log('assignTickets function executed successfully.');
        //       }else{
        //         res.status(200).json({ message: 'Assigned tickets successfully , no more tickets to assign', result });
        //       }
        //     } catch (err) {
        //       console.error('Error in cron job:', error);
        //     }
        // });
    
       
      } catch (error) {
        // Handle errors
        console.error('Error assigning tickets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
   },

    
  
  

};
module.exports =systemController;
