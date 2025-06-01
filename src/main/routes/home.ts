import { getFormattedDate } from '../helper/date-helper';

import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
      const cases = await axios.get('http://localhost:4000/case/getAllCases');
      res.render('home',
        {
          'cases': cases.data
        }
      );
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });

  app.get('/case/:id', async (req, res) => {
      try {
        const caseId = req.params.id;
        const response = await axios.get('http://localhost:4000/case/' + caseId);
        res.render('view-case', { 'case': response.data });
      } catch (error) {
        console.error('Error making request:', error);
        res.render('home', {});
      }
    }
  );

app.get('/search-case', async (req, res) => {
    try {
      const searchQuery = req.query;
      const response = await axios.get(`http://localhost:4000/case/searchCases?caseNumber=${searchQuery.caseNumber}&title=${searchQuery.title}`);
      res.render('home', { 'cases': response.data });
    } catch (error) {
      console.error('Error making request:', error);
      res.status(500).send('An error occurred while searching for the case.');
    }
  });

  app.get('/add-case', async (req, res) => {
    res.render('add-case', {});
  });

  app.post('/add-case', async (req, res) => {
    try {
      const { caseNumber, title, description, status } = req.body;

      const formattedDate = getFormattedDate();
      const response = await axios.post('http://localhost:4000/case/addCase', {
        caseNumber,
        title,
        description,
        status,
        createdDate: formattedDate
      });

      if (response.status === 200) {
        res.redirect('/');
      } else {
        res.status(response.status).send('Failed to add case.');
      }
    } catch (error) {
      res.status(500).send('An error occurred while adding the case.');
    }
  });

  app.get('/delete-case/:id', async (req, res) => {
      try {
        const caseId = req.params.id;
        const response = await axios.get('http://localhost:4000/case/' + caseId);
        res.render('delete-case', { 'case': response.data });
      } catch (error) {
        console.error('Error making request:', error);
        res.render('home', {});
      }
    }
  );

  app.get('/delete/:id', async (req, res) => {
    try {
      const caseId = req.params.id;
      console.log(`Attempting to delete case with ID: ${caseId}`);
      const response = await axios.delete(`http://localhost:4000/case/${caseId}`);
      if (response.status === 200) {
        res.redirect('/');
      } else {
        return res.status(response.status).send('Failed to delete case.');
      }
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json({ error: error.response.data });
      }

      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}
