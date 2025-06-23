import express from 'express';
import { queryNcRNA, queryMiRNAFromCSV } from '../services/ncRNAService.js';

const router = express.Router();

// 查询基因相关的ncRNA
router.get('/query', async (req, res) => {
  try {
    const { gene, type } = req.query;
    
    if (!gene) {
      return res.status(400).json({ error: '基因名称不能为空' });
    }

    if (!type || !['miRNA', 'lncRNA', 'circRNA', 'all'].includes(type)) {
      return res.status(400).json({ error: '无效的ncRNA类型' });
    }

    let results;

    // 如果查询miRNA，优先使用CSV文件数据
    if (type === 'miRNA') {
      results = await queryMiRNAFromCSV(gene);
    } else {
      results = await queryNcRNA(gene.toUpperCase(), type);
    }
    
    res.json({
      gene: gene.toUpperCase(),
      type,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('查询ncRNA失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取数据库状态
router.get('/status', async (req, res) => {
  try {
    // 这里可以添加数据库状态检查逻辑
    res.json({
      status: 'ok',
      message: 'ncRNA数据库服务正常'
    });
  } catch (error) {
    console.error('获取ncRNA服务状态失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
