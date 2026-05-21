-- Custom SQL migration file, put your code below! --
ALTER TABLE `courses` ADD FULLTEXT `idx_search` (`title`, `description`);
